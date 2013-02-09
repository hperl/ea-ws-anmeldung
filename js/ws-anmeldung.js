window.response = new ResponseModel();

function ResponseModel() {
  var _this = this;

  // stubs for compilance with WorkshopModel
  _this.selectWS = function() {}
  _this.isSelected = ko.observable();
  _this.wsSlots = ko.observable();
  _this.wsTitle = ko.observable();
  _this.wsDescription = ko.observable();
  _this.text = ko.observable();

  _this.workshops = ko.observableArray();
  _this.selectedWorkshops = ko.computed(function() {
    return _(_this.workshops())
      .filter(function(ws) { return ws.isSelected() })
      .sort(function(a, b) { return a.wsSlots[0] < b.wsSlots[0] });
  })
  _this.submit = function() {
    var submission = [];
    submission.push($("#inputName").val());
    submission.push($("#inputEmail").val());
    submission.push($("#inputLG").val());
    if ($("#optionsArrivalElse:checked").length) {
      submission.push($("#inputArrival").val());
    } else {
      submission.push("");
    }
    if ($("#optionsDepartureElse:checked").length) {
      submission.push($("#inputDeparture").val());
    } else {
      submission.push("");
    }
    // Ernährung
    if ($("#optionsDietElse:checked").length) {
      submission.push($("#inputDiet").val());
    } else {
      submission.push($.trim($("[name=optionsDiet]:checked").parent().text()));
    }
    // Workshops
    submission.push(_.map(_this.selectedWorkshops(), function(ws) {
      return ws.wsTitle()
    }).join(';'));
    // prepare ...
    submission = submission.join(';');
    $('#submission').html(submission);
    // post results
    $.ajax({
      type: 'PUT',
      url: 'anmeldung.php',
      data: submission
    }).done(function()  {$('#successModal').modal('show');})
      .error(function(jqxhr) {
        $('#errorModal').modal('show');
      });
    return false;
  }
}

function WorkshopModel($wsEl) {
  var _this = this,
      $el = $wsEl,
      wsData = $wsEl.data();

  _this.isSelected = ko.observable(false);
  _this.wsSlots = ko.observable(_.flatten([wsData.wsSlot]));
  _this.wsTitle = ko.observable(wsData.wsTitle);
  _this.recommendedFor = ko.observable(wsData.recommendedFor);
  _this.wsDescription = ko.observable(wsData.wsDescription);
  _this.text = ko.computed(function() {
    return _this.wsTitle() +
      '<span class="pull-right"><i class="icon-ws"></i></span>' +
      '<br>' + _this.wsDescription();
  })

  _this.selectWS = function(data, event) {
    if (_this.isSelected()) {
      _this.isSelected(false);
    } else {
      $el.siblings('.ws').removeClass('selected');
      _.each(response.workshops(), function(ws) {
        if (_.intersection(ws.wsSlots(), _this.wsSlots()).length != 0) {
          ws.isSelected(false);
        }
      })
      _this.isSelected(true);
    }
    response.workshops.valueHasMutated();
  }
}

ko.applyBindings(window.response);
$('.ws').each(function() {
  var w = new WorkshopModel($(this));
  response.workshops.push(w);
  ko.applyBindings(w, this);
})

function recommendNeulinge() {
  _.chain(response.workshops())
    .filter(function(ws) { return ws.recommendedFor() == "neulinge" })
    .each(function(ws)   { ws.selectWS() });
}
