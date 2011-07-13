// A sample extension of the $startup.utils object
(function(S){
	if (!S) { return false; }
	
	var Add = S.utils.Add;
	
	//Gets query string values
	Add("queryStr",function(param){
		var x, val = false, query = window.location.search.substr(1), qArr = query.split("&"), len = qArr.length;
		for (x = 0; x < len; x++) {
			var pair = qArr[x].split("=");
			if (pair[0]===param) { val = ""+decodeURIComponent(pair[1]); break; } // "" to make sure to return a string
		}
		return val;
	});
	
	// Get hash values
	Add("getHash",function(param){
		var x, val = false, query = window.location.hash.substr(1), qArr = query.split("&"), len = qArr.length;
		for (x = 0; x < len; x++) {
			var pair = qArr[x].split("=");
			if (pair[0]===param) { val = ""+decodeURIComponent(pair[1]); break; } // "" to make sure to return a string
		}
		return val;
	});
	
	// console log
	Add("log",function(str){
		return cLog(str);
	});
	
	//utils for date/time items
	/*	date/time formatting
		Sample usage:
			var dateObj = new Date();
			fox.utils.datetime.format(dateObj,"Today is: ${ddTH} of ${month} ${yr}");
		
			- will return string: Today is 9th of December 2009
	*/
	
	Add("datetime",{
		format: function(date,formatStr) {
			formatStr = formatStr||null; // format is optional
		
			var obj = {
				// date
				month: date.getUTCMonth(),
				day: date.getDay(),
				year: date.getFullYear(),
				"date": date.getDate(),
				// time
				hour: date.getHours(),
				minutes: date.getMinutes(),
				seconds: date.getSeconds(),
				ampm: ((date.getHours()<12)?'am':'pm'),
				fullStr: date.toString()
			};
		
			var replace = {
				"${mm}": (obj.month+1),
				"${month}": this.getUTCMonthString(obj.month),
				"${month:short}": this.getUTCMonthString(obj.month,'short'),
				"${day}": this.getDayString(obj.day),
				"${day:short}": this.getDayString(obj.day,'short'),
				"${yr}": obj.year,
				"${dd}": ((obj.date<10)?'0'+obj.date:obj.date),
				"${ddTH}": this.oldEnglish(obj.date),
				"${hr}": ((obj.hour>12)?obj.hour-12:obj.hour),
				"${hr:mil}": obj.hour,
				"${min}": ((obj.minutes<10)?'0'+obj.minutes:obj.minutes),
				"${sec}": ((obj.seconds<10)?'0'+obj.seconds:obj.seconds),
				"${ampm}": obj.ampm,
				"${AMPM}": (obj.ampm).toUpperCase(),
				"${AmPm}": ((obj.ampm).charAt(0)).toUpperCase()+(obj.ampm).charAt(1)
			};
		
			if (formatStr===null) { // from old format date
				var month = this.getUTCMonthString(obj.month), dateString = date.toDateString();
				return month + ' ' + dateString.substr(8).replace(' ', ', '); //Wed Sep 02 2009
			} else {
				var i; for (i in replace) {
					var idx = formatStr.indexOf(i);
					while (idx!==-1) {
						formatStr = formatStr.replace(i,replace[i]);
						idx = formatStr.indexOf(i);
					}
				}
				return formatStr;
			}
		},
	
		// old english(?) format
		oldEnglish: function(num) {
			num+="";
			var lastDigit = parseInt(num.charAt(num.length-1),10);
			switch (lastDigit) {
				case 1: num+="st";break;
				case 2: num+="nd";break;
				case 3: num+="rd";break;
				default: num+="th";break;
			}
			return num;
		},
	
		// Return month string
		getUTCMonthString: function(monthNum,type) {
			type = type||'full'; //type is optional
			var month = ["January","February","March","April","May","June","July","August","September","October","November","December"],
				sel = month[monthNum];
			return (type==="short") ? sel.substr(0,3) : sel;
		},
	
		// Return week days string
		getDayString: function(dayNum,type) {
			type = type||'full';
			var day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
				sel = day[dayNum];
			return (type==="short") ? sel.substr(0,3) : sel;	
		}
	});
	
	function cLog(str) {
		if (console && typeof console.log==="function") { console.log(str); }
	}
	
}($tartup || false));