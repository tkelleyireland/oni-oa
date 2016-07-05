var FlowDispatcher = require('../dispatchers/OniDispatcher');
var FlowConstants = require('../constants/OniConstants');

var StoryBoardActions = {
    reloadComments: function ()
    {
        FlowDispatcher.dispatch({
            actionType: FlowConstants.RELOAD_COMMENTS
        });
    },
    selectComment: function (comment)
    {
        FlowDispatcher.dispatch({
            actionType: FlowConstants.SELECT_COMMENT,
            comment: comment
        });
    }
};

module.exports = StoryBoardActions;
