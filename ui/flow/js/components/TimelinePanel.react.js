var React = require('react') ;   
var TimelineStore = require('../stores/TimelineStore');


function buildGraph (root, ipsrc) {

    var chartPlaceholder = $(this.getDOMNode());
    chartPlaceholder.html("");
    document.getElementById('legend').innerHTML = '';
    var names = [];
    // var columns = ["tstart", "tend", "srcip", "dstip", "sport", "dport", "pkts", "bytes"];
    var data = [];
    var dataDate = root.date.split(' ')[0];
    var endTime = Date.parse(dataDate + " 23:59");
 
    var startTime = Date.parse(dataDate + " 00:00");
    csvdata = root.children;

    names = [];

    csvdata.forEach(function (d) {
        if (names.indexOf(d.srcip) == -1) {
            names.push(d.srcip);
        }
        if (names.indexOf(d.dstip) == -1) {
            names.push(d.dstip);
        }
    });

    function createEvent(name) {
        var event = {};
        event.name = name;
        event.dates = [];
        event.ports = [];

        csvdata.filter(function (d) {
            if (d.srcip == name) {
                event.dates.push(parseddate(d.tstart));
                event.ports.push(parseInt(d.sport));
            }
            return;
        });

        return event;
    }

    function parseddate(sdate) {
        dtpart = sdate.split(" ")
        dpart = dtpart[0].split("-")
        tpart = dtpart[1].split(":")
        //The 7 numbers specify the year, month, day, hour, minute, second, and millisecond, in that order:
        //2014-07-08 02:38:59
        pdate = new Date(parseInt(dpart[0]), parseInt(dpart[1]) - 1, parseInt(dpart[2]), parseInt(tpart[0]) - 1, parseInt(tpart[1]) - 1, parseInt(tpart[2]) - 1);

        return pdate
    }

    for (var i = 0; i < names.length; i++) {
        var event = createEvent(names[i])
        if (event.dates.length > 0) {
            data.push(event);
        }
    }    

    var color = d3.scale.category10();

    var locale = d3.locale({
        "decimal": ",",
        "thousands": " ",
        "grouping": [3],
        "dateTime": "%A %e %B %Y, %X",
        "date": "%d/%m/%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    });

    var width = chartPlaceholder.width()-5; // 5 is the magic number to avoid having horizontal scroll bar
 
    var graph = d3.chart.eventDrops()
        .start(new Date(startTime))
        .end(new Date(endTime))
        .locale(locale)
        .eventColor(function (datum) {
            return color(datum.ports);
        })
        .width(width)
        .margin({ top: 70, left: 140, bottom: 5, right: 5 })
        .axisFormat(function (xAxis) {
            xAxis.ticks(5);
        })
        .eventHover(function (el) {
            var series = el.parentNode.firstChild.innerHTML.replace(/\(\d+\)/g, "");
            var port = el.parentNode.__data__.ports[0];
            var timestamp = d3.select(el).data()[0]
            document.getElementById('legend').innerHTML = 'Hovering [' + timestamp + '] <br /> in series "' + series + '" at port ' + port;
        });

    var element = d3.select(chartPlaceholder[0]).append('div').datum(data);
    
    graph(element);

    // var updateDelimiter = function (value) {
    //     graph.hasDelimiter(!graph.hasDelimiter())(element);
    // }

    // var addLine = function () {
    //     var data = element.datum();
    //     var i = data.length;
    //     data.push(createEvent(names[i]));
    //     elements = element.datum(data);
    //     graph(element);
    // }

    // var removeLine = function () {
    //     var data = element.datum();
    //     data.pop();
    //     element = element.datum(data);
    //     graph(element);
    // }
}
 


var TimelinePanel = React.createClass({  
    componentDidMount: function ()
    {
        TimelineStore.addChangeDataListener(this._onChange); 
    },
    componentWillUnmount: function ()
    {
        TimelineStore.removeChangeDataListener(this._onChange); 
    },
    _onChange: function ()
    {
        var state, filterName, root;
        state = TimelineStore.getData();
        document.getElementById('legend').innerHTML = '';
        
        root = {
            name: TimelineStore.getFilterValue(),
            date: '',
            children: []
        };

        if (!state.loading && !state.error)
        {
            filterName = TimelineStore.getFilterName();
            root.date = TimelineStore._sdate;
            root.children = state.data;  
        }

        state.root = root;
        delete state.data;

        this.setState(state);
    },
    getInitialState: function ()
    {
        return {loading: false};
    },
    render:function()
    {
        var content; 

        if (this.state.error)
        {
            content = this.state.error;
        }
        else if (this.state.loading)
        {
            content = (
            <div className="oni_loader">
                Loading <span className="spinner"></span>
            </div>
          );
        }
        else
        {
            content = '';
        }
        return ( 
                <div>{content}</div>  
        )
    },
    componentDidUpdate: function ()
    {
        if (!this.state.loading && !this.state.error)
        {
            buildGraph.call(this, this.state.root);
        }
    }
});

module.exports = TimelinePanel;
