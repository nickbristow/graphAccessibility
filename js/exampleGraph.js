function print_filter(filter){
  var f=eval(filter);
  if (typeof(f.length) != "undefined") {}else{}
  if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
  if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
  console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
} 

$(document).ready(function(){
  var synth = T("SynthDef").play();

    synth.def = function(opts) {
      var osc1, osc2, env;
      osc1 = T("saw", {freq:opts.freq         , mul:0.25});
      osc2 = T("saw", {freq:opts.freq * 1.6818, mul:0.20});
      env  = T("linen", {s:450, r:250, lv:0.5}, osc1, osc2);
      return env.on("ended", opts.doneAction).bang();
    };

    


  var data = [
      {date: "12/27/2012", http_404: 2, http_200: 190, http_302: 100},
      {date: "12/28/2012", http_404: 2, http_200: 10, http_302: 100},
      {date: "12/29/2012", http_404: 1, http_200: 300, http_302: 200},
      {date: "12/30/2012", http_404: 2, http_200: 90, http_302: 0},
      {date: "12/31/2012", http_404: 2, http_200: 90, http_302: 0},
      {date: "01/01/2013", http_404: 2, http_200: 90, http_302: 0},
      {date: "01/02/2013", http_404: 1, http_200: 10, http_302: 1},
      {date: "01/03/2013", http_404: 2, http_200: 90, http_302: 0},
      {date: "01/04/2013", http_404: 2, http_200: 90, http_302: 0},
      {date: "01/05/2013", http_404: 2, http_200: 90, http_302: 0},
      {date: "01/06/2013", http_404: 2, http_200: 200, http_302: 1},
      {date: "01/07/2013", http_404: 1, http_200: 200, http_302: 100}
      ];

  var ndx = crossfilter(data);
  var parseDate = d3.time.format("%m/%d/%Y").parse;
  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.total= d.http_404+d.http_200+d.http_302;
  });
  //print_filter(data);  
  var dateDim = ndx.dimension(function(d) {return d.date;});
  var hitsDim = ndx.dimension(function(d){return d.total;});
  var hits = dateDim.group().reduceSum(function(d) {return d.total;}); 

  var minDate = dateDim.bottom(1)[0].date;
  var maxDate = dateDim.top(1)[0].date;
  var maxHits = hitsDim.top(1)[0].total;
  var minHits = hitsDim.bottom(1)[0].total;
  console.log(minHits);
  console.log(maxHits);

  var hitslineChart  = dc.lineChart("#chart-line-hitsperday"); 

  hitslineChart
    .width(500).height(200)
    .dimension(dateDim)
    .group(hits)
    .x(d3.time.scale().domain([minDate,maxDate]));
  hitslineChart.renderlet(function(d){
    
    var data = hits.all(),
        values=[];

    for (var i= 0; i<data.length; i++)
    {
      values.push((data[i].value/maxHits)*100);
    }
    console.log(values);
    T("interval", {interval:500}, function(count) {
      //var noteNum  = 69 + [0, 2, 4, 5, 7, 9, 11, 50][count % 8];
      var noteNum = 69 + values[count % values.length];
      var velocity = 64 + (count % 64);
      synth.noteOn(noteNum, velocity);
    }).start();


  }); 
  dc.renderAll();
});




