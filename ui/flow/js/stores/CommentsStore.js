var d3 = require('d3');
var assign = require('object-assign');

var OniConstants = require('../../../js/constants/OniConstants');
var FlowConstants = require('../constants/NetflowConstants');
var FlowDispatcher = require('../../../js/dispatchers/OniDispatcher');
var RestStore = require('../../../js/stores/RestStore');

var CommentsStore = assign(new RestStore(FlowConstants.API_COMMENTS), {
  _parser: d3.dsv('|', 'text/plain'),
  errorMessages: {
    404: 'Please choose a different date, no comments have been found'
  },
  setDate: function (newDate)
  {
    date = newDate;
    this.setEndpoint(FlowConstants.API_COMMENTS.replace('${date}', date.replace(/-/g, '')));
  } 
});

FlowDispatcher.register(function (action) {
  switch (action.actionType) {
    case OniConstants.UPDATE_DATE:
      CommentsStore.setDate(action.date);
      break;
    case OniConstants.RELOAD_COMMENTS:
      CommentsStore.reload();
      break;
  }
});

module.exports = CommentsStore;
