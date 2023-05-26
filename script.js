// Play with the inputs -->
var flights = [
{
  currency: "₹",
  price: 8000,
  carrier: "AI",
  time: "2h 30min",
  nodes: ["CDG 2017-05-30T09:35+02:00 AMS 2017-05-30T11:15+02:00"] },

{
  currency: "₹",
  price: 11000,
  carrier: "VIS",
  time: "2h 30min",
  nodes: ["CDG 2017-05-30T12:35+02:00 AMS 2017-05-30T13:50+02:00"] },

{
  currency: "₹",
  price: 10676,
  carrier: "IG",
  time: "2h 30min",
  nodes: ["CDG 2017-05-30T11:40+02:00 AMS 2017-05-30T12:55+02:00"] },

{
  currency: "₹",
  price: 7800,
  carrier: "VIS",
  time: "2h 30min",
  nodes: ["CDG 2017-05-30T18:35+02:00 AMS 2017-05-30T19:50+02:00"] },

{
  currency: "₹",
  price: 19890,
  carrier: "AI",
  time: "2h 30min",
  nodes: ["CDG 2017-05-30T11:40+02:00 AMS 2017-05-30T12:55+02:00"] }];



var carrier = {
  "AI": "Air India",
  "VIS": "Vistara Airlines",
  "IG": "Indigo Airlines" };


var airports = [{ "name": " Indira Gandhi International Airport", "city": "Delhi", "country": "India", "IATA": "DEL" }, { "name": "Chhatrapati Shivaji Maharaj International Airport", "city": "Mumbai", "country": "India", "IATA": "BOM" }, { "name": "Jaipur International Airport", "city": "Jaipur", "country": "India", "IATA": "JAI" }, { "name": "Kempegowda International Airport", "city": "Bangalore", "country": "India", "IATA": "BLR" }, { "name": "Chennai International Airport", "city": "Chennai", "country": "India", "IATA": "MAA" }, { "name": "Rajiv Gandhi International Airport", "city": "Hyderabad", "country": "India", "IATA": "HYD" }];

(function () {

  var _airports = _.groupBy(airports, o => o.country),
  selectIndex = [],
  selectData = [];

  _.each(_airports, (countryList, countryName) => {
    var firstLeter = countryName.split('')[0];
    selectData.push(`<li class="sep" data-index="${firstLeter}">${countryName}</li>`);
    selectIndex.push(`<li>${firstLeter}</li>`);

    _.each(countryList, (airport, i) => {
      selectData.push(`<li data-iata="${airport.IATA}" data-city="${airport.city}">
				${airport.IATA}, ${airport.name}</li>`);
    });
  });

  $('.select ul.select-index').html(_.uniq(selectIndex).join(''));
  $('.select ul.select-data').html(selectData.join(''));


  // Calendar days
  var days = [30];
  for (var i = 0; i < 31; i++) {days.push(i);}

  var daysRender = _.map(days, function (i) {
    return `<span>${i + 1}</span>`;
  });

  $('.calendar .days').html(daysRender.join(''));
  $('.calendar .days span').eq(8).addClass('checked');

  // Flight Results
  doFlightsRender(true);


  // Events
  // Open inputs
  $('.control:not(.open) .control-head').on('click', function (evt) {
    $(evt.currentTarget).parent('.control').addClass('open');
  });

  $('.control .close').on('click', function (evt) {
    var z = $(evt.currentTarget).closest('.control');
    setTimeout(() => {z.removeClass('open');}, 50);
  });

  // SpinnerInput add/substract action
  $('.spinner button').on('click', function (evt) {
    var isAdding = evt.currentTarget.getAttribute('data-action') == 'plus',
    $input = $('input[name="passengers"]:checked'),
    $control = $input.siblings('div').find('span'),
    value = parseInt($control.text());

    if (isAdding)
    value++;else
    if (value !== 0)
    value--;

    $control.text(value);
  });

  // SelectInput find index
  $('.select-index').on('click', 'li', function (evt) {
    var index = evt.currentTarget.textContent,
    $nano = $(evt.currentTarget).parent('.select-index').siblings('.nano'),
    el = $nano.find(`li.sep[data-index="${index}"]`)[0];

    $nano.find('.nano-content').animate({ scrollTop: el.offsetTop }, 600);
  });

  // SelectInput set data
  $('.select-data').on('click', 'li:not(.sep)', function (evt) {
    var text = evt.currentTarget.textContent,
    iata = evt.currentTarget.getAttribute('data-iata'),
    $select = $(evt.currentTarget).closest('.select'),
    $nameContainer = $select.find('.airport-name');

    if ($nameContainer.data('role') == 'from') {
      var _iata = iata.split('');
      var div = $('.header .fromPlace').addClass('rotate');
      var span = $('.header .fromPlace span');
      span.eq(0).text(_iata[0]);
      span.eq(1).text(_iata[1]);
      span.eq(2).text(_iata[2]);
      setTimeout(() => div.removeClass('rotate'), 900);
      //$('.xfrom').text(iata);
    } else
    {
      var _iata = iata.split('');
      var div = $('.header .toPlace').addClass('rotate');
      var span = $('.header .toPlace span');
      span.eq(0).text(_iata[0]);
      span.eq(1).text(_iata[1]);
      span.eq(2).text(_iata[2]);
      setTimeout(() => div.removeClass('rotate'), 900);
      //$('.xto').text(iata);
    }

    $nameContainer.text(text);
    $select.toggleClass('open');

    $(evt.currentTarget).addClass('selected').siblings('li').removeClass('selected');
  });

  // Date input
  $('.calendar .days span').on('click', function (evt) {
    var $this = $(evt.currentTarget),
    day = evt.currentTarget.textContent;

    $this.addClass('checked').siblings('span').removeClass('checked');

    var date = new Date(`5/${day}/2017`);
    var [wd, m, d] = date.toDateString().split(' ');
    $('.dateinput .control-item span').eq(0).text(`${wd.toUpperCase()}, ${d} ${m}`);
  });


  $('.btnBack').on('click', function (evt) {
    var wrap = document.querySelector('.wrap'),
    index = parseInt(wrap.getAttribute('data-pos'));

    $('.ticket button.btnBook').text('Book Flight');
    wrap.setAttribute('data-pos', index - 1);
  });

  // Search button
  $('.btnSearch').on('click', function (evt) {
    doFlightsRender(false);
    setTimeout(() => {
      document.querySelector('.wrap').setAttribute('data-pos', 1);
    }, 50);
  });

  $('.ticket button').on('click', function (evt) {
    var $button = $(evt.currentTarget);
    var $loader = $('.loader').show();
    $button.text('Just A Sec Buddy...');

    setTimeout(() => {
      $loader.hide();
      $button.html('<i class="zmdi zmdi-check-circle"></i> Flight Booked');
      $button.addClass('success');
    }, 1200);
  });

  // Select Flight
  $('.list').on('click', 'article', function (evt) {
    var index = parseInt(evt.currentTarget.getAttribute('data-index')),
    flight = flights[index];

    var [from, t1, to, t2] = flight.nodes[0].split(' ');

    var p = $('.radio.passengers label span'),
    peopleTotal = 0,
    people = _.map(p, function (el, i) {
      var v = parseInt(el.textContent),
      str = '';

      if (i == 0 && v)
      str = `${v} Adults`;
      if (i == 1 && v)
      str = `${v} Kids`;
      if (i == 2 && v)
      str = `${v} Elders`;

      peopleTotal += v;

      return str;
    });

    from = $('.fromPlace span').text();
    to = $('.toPlace span').text();

    var time1 = new Date(t1),
    time2 = new Date(t2);

    var clase = $('input[name="seat"]:checked').val(),
    dates = $('.dateinput .control-item span'),
    place1 = _.findWhere(airports, { IATA: from }),
    place2 = _.findWhere(airports, { IATA: to });

    var flightRender = `
			<div class="title">
				<div>
					<small>${time1.toLocaleTimeString().replace(':00', '')}</small>
					<span>${from}</span>
					<small>${place1.city}</small>
				</div>
				<span class="separator"><i class="zmdi zmdi-airplane"></i></span>
				<div>
					<small>${time2.toLocaleTimeString().replace(':00', '')}</small>
					<span>${to}</span>
					<small>${place2.city}</small>
				</div>
			</div>
			<div class="row">
				<div class="cell">
					<small>Passengers</small><span>${_.compact(people).join(',')}</span>
				</div>
				<div class="cell">
					<small>Class</small><span>${clase}</span>
				</div>
			</div>
			<div class="row">
				<div class="cell">
					<small>Departure</small><span>${dates[0].textContent}</span>
				</div>
				<div class="cell">
					<small>Return</small><span>${dates[1].textContent}</span>
				</div>
			</div>
			<div class="row">
				<div class="cell">
					<small>Airline</small><span>${carrier[flight.carrier]}</span>
				</div>
				<div class="cell">
				</div>
			</div>
			<div class="total">
				<small>Total</small> <span> ₹ ${(flight.price * peopleTotal).toFixed(2)}</span>
			</div>
		`;

    $('.ticket section').html(flightRender);
    setTimeout(() => {
      document.querySelector('.wrap').setAttribute('data-pos', 2);
    }, 50);
  });

  // Init scroll
  $(".nano").nanoScroller();


  function doFlightsRender(isInit) {
    var flightsRender = _.map(flights, function (o, i) {
      var sumText = "";
      var [from, t1, to, t2] = o.nodes[0].split(' ');

      var d1 = new Date(t1),
      d2 = new Date(t2);

      if (!isInit) {
        var ppl = $('.radio.passengers label span'),
        sum = parseInt(ppl.eq(0).text()) + parseInt(ppl.eq(1).text()) + parseInt(ppl.eq(2).text());

        sumText = `${sum} people & ₹${(o.price * sum).toFixed(2)}`;
        from = $('.fromPlace span').text();
        to = $('.toPlace span').text();
      }

      var img;
      if (o.carrier == 'AI')
      img = 'airindia.jpeg';else
      if (o.carrier == 'IG')
      img = 'indigo.png';else

      img = 'vistara.png';
      return `<article data-index="${i}">
				<div class="img">
					<img src="${img}" alt="ualogo" />
				</div>
				<div class="info">
					<span class="time">${o.time}</span>
					<span class="airline">
						${d1.toLocaleTimeString().replace(':00', '')} - 
						${d2.toLocaleTimeString().replace(':00', '')}
					</span>
					<span>${carrier[o.carrier]} ${from} - ${to}</span>
					<span>Non-Stop</span>

					<h5><small>${sumText}</small> ₹${o.price}</h5>
				</div>
			</article>`;
    });

    $('.list .nano-content').html(flightsRender.join(''));
    
  }

})();