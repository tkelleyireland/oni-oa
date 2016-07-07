var FlowDispatcher = require('../dispatchers/OniDispatcher');
var OniConstants = require('../constants/OniConstants');

var StoryBoardActions = {
    reloadComments: function ()
    {
        FlowDispatcher.dispatch({
            actionType: OniConstants.RELOAD_COMMENTS
        });
    },
    selectComment: function (comment)
    {
        FlowDispatcher.dispatch({
            actionType: OniConstants.SELECT_COMMENT,
            comment: comment
        });
    }
};

module.exports = StoryBoardActions;
