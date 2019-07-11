const pingNianDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const runNianDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

class DateTimeHelper {

  static addTime(start, factor) {
    let copy = {
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      getTime: function () {//TODO 这里有一个很奇怪的bug，如果按照常理，下面这个应该写为 this.minute<10，可以必须要写成<9,什么鬼？
        return (this.hour < 10 ? ('0' + this.hour) : this.hour) + ":" + ((this.minute.toFixed(0) + '').length > 1 ? this.minute.toFixed(0) : ('0' + this.minute.toFixed(0)));
      },
      getDate: function () {
        return this.month + "/" + this.day;
      }
    };
    let minutes = factor % 60;    // 取剩余分钟数
    let hours = (factor - minutes) / 60;  //取小时数
    copy.minute = start.minute + minutes;
    if (copy.minute >= 60) {
      copy.hour += 1;
      copy.minute -= 60;
    }

    copy.hour += hours;
    copy.hour += start.hour;
    let hourCount = copy.hour;    //记录总hour数
    if (copy.hour >= 24) {
      copy.day += Math.floor(copy.hour / 24);
      copy.hour -= 24 * Math.floor(copy.hour / 24);
    }

    copy.day += start.day;

    copy.month = start.month;
    copy.year = start.year;
    //做好判断，针对月份的
    if (DateTimeHelper.isLeapYear(start.year || new Date().getUTCFullYear())) {
      if (copy.day > runNianDays[start.month - 1]) {
        copy.day = Math.floor(hourCount / 24);
        copy.month += 1;
      }
    } else {
      if (copy.day > pingNianDays[start.month - 1]) {
        copy.day = Math.floor(hourCount / 24);
        copy.month += 1;
      }
    }

    if (copy.month > 12) {
      copy.month = 1;
      copy.year += 1;
    }

    return copy;
  }

  static isLeapYear(year) {
    return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
  }

  /**
   * 获取多少个小时
   * @param startTime
   * @param endTime
   * @returns {number}
   */
  static getDuration(startTime, endTime) {

    var date1 = `${endTime.year ? endTime.year : new Date().getUTCFullYear()}/${endTime.month}/${endTime.day} ${endTime.hour}:00:00`;  //开始时间
    var date2 = `${startTime.year ? startTime.year : new Date().getUTCFullYear()}/${startTime.month}/${startTime.day} ${startTime.hour}:00:00`;    //结束时间
    var date3 = new Date(date1).getTime() - new Date(date2).getTime();   //时间差的毫秒数

    return date3 / 1000.0 / 60.0;
  }

  static getTimestamp(date) {
    //"2014-07-10 10:21:12"
    let d = new Date(`${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute}:00`);
    return d.getTime();
  }

  static timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
  }


  static getMonthDay(month) {
    let day31 = [1, 3, 5, 7, 8, 10, 12]
    let day30 = [4, 6, 9, 11];
    if (day31.indexOf(month) != -1) {
      return 31;
    } else if (day30.indexOf(month) != -1) {
      return 30;
    } else {
      if (new Date().getFullYear() % 4 == 0 || new Date().getFullYear() % 100 == 0) {
        return 29;
      } else {
        return 28;
      }
    }
  }


  static formCurDate() {         //今天的日期
    let date = new Date();
    return date.getFullYear() + "." + this.formTime(date.getMonth() + 1) + "." + this.formTime(date.getDate()) + " " + this.formTime(date.getHours()) + ":00";
  }

  static formPreDate() {            //前一天的日期
    let cur_year = new Date().getFullYear();
    let cur_month = new Date().getMonth() + 1;
    let cur_day = new Date().getDate();
    if (cur_day - 1 > 0) {
      let day = cur_day - 1;
      return cur_year + "." + this.formTime(cur_month) + "." + this.formTime(day) + " " + this.formTime(new Date().getHours()) + ":00";
    } else {
      let month = cur_month - 1 > 0 ? cur_month - 1 : 12;
      return this.formPreMonth(cur_month) + "." + this.getMonthDay(month) + " " + this.formTime(new Date().getHours()) + ":00";
    }
  }

  static formPreDefineDate(count) {            //前九个小时日期
    let cur_year = new Date().getFullYear();
    let cur_month = new Date().getMonth() + 1;
    let cur_day = new Date().getDate();
    let cur_hour = new Date().getHours();   //获取当前小时
    if (cur_hour - count > 0) {
      return cur_year + "." + this.formTime(cur_month) + "." + this.formTime(cur_day) + " " + this.formTime(cur_hour - count) + ":00";
    } else if (cur_day > 1) {    //减一天
      return cur_year + "." + this.formTime(cur_month) + "." + this.formTime(cur_day - 1) + " " + this.formTime(cur_hour - count + 24) + ":00";
    } else if (cur_day === 1) {    //减一个月份、年份
      return cur_month > 1 ? cur_year + "." + this.formTime(cur_month - 1) + "." + this.getMonthDay(cur_month - 1) + " " + this.formTime(cur_hour - count + 24) + ":00"
        : (cur_year - 1) + ".12.31" + " " + this.formTime(cur_hour - count + 24) + ":00";
    }
  }

  static formPreMonth(month) {     //1-12
    let preMonth = month - 1;
    if (preMonth > 0) {
      return new Date().getFullYear() + "." + this.formTime(preMonth);
    } else {
      return (new Date().getFullYear() - 1) + "." + 12;
    }
  }

  static formTime(time) {    //01格式
    if (time < 10) {
      return "0" + time;
    } else {
      return time;
    }
  }

  static setStopRange(count) {
    let stops = [];
    let rate = count >= 0 ? (count + 1) / 2 : 1 / (1 + Math.abs(count));
    for (let i = 0; i < 3000; i++) {
      // stops.push([i, i * rate / 2]);
      stops.push([i, i]);
    }
    return stops;
  }

  static setFactorRange(count) {
    let stops = [];
    //TODO:step6速度/饱和度影响宽度调整
    let rate = count >= 0 ?1 + count/20 : 1 / (1 - Math.abs(count)/20);
    for (let i = 0; i < 3000; i++) {
      stops.push([i, i * rate]);
    }
    return stops;
  }

  static setFlowRange(count) {
    let stops = [];
    let rate = count >= 0 ? (count + 1) / 2 : 1 / (1 + Math.abs(count));
    for (let i = 0; i < 2000; i++) {
      stops.push([i, i / 60]);
    }
    return stops;
  }

  static setNormalRange(count) {
    let stops = [];
    let rate = count >= 0 ? (count + 1) / 2 : 1 / (1 + Math.abs(count));
    for (let i = 0; i < 2000; i++) {
      stops.push([i, i / 5]);
    }
    return stops;
  }

  static setBufferRatio(count){
    let stops = [];
    let rate = count >= 0 ? (count + 1) / 2 : 1 / (1 + Math.abs(count));
    count = count -10;
    for (let i = 0; i < 3000; i++) {
      // stops.push([i, count === 0 ?i : count > 0 ? i*(1+count/10) : i*(1/(Math.abs(count)/2+1))]);
      stops.push([i, count === 0 ?i : count > 0 ? i*(1+Math.pow(count,2)/10) : i*(1/(Math.pow(Math.abs(count),2)+1))]);
    }
    return stops;
  }

  static setBackBufferRatio(count){
    let stops = [];
    for (let i = 0; i < 3000; i++) {
      stops.push([i, count === 0 ?(i/100) : count > 0 ? (i/100)*(1+count/10) : (i/100)*(1/(Math.abs(count)+1))]);
    }
    return stops;
  }

  static setFlowCompareBufferRatio(count){
    count = count -10;
    let stops = [];
    for (let i=-2000; i<2000; i++) {
      // stops.push([i, count === 0 ?i : count > 0 ? Math.abs(i)*(1+count/10) : Math.abs(i)*(1/(Math.abs(count)/2+1))]);
      stops.push([i, count === 0 ?i : count > 0 ? Math.abs(i)*(1+Math.pow(count,2)/10) : Math.abs(i)*(1/(Math.pow(count,2)+1))]);
    }
    return stops;
  }

  static setBufferRange(count) {
    let stops = [];
    count = (count-20)/2;
    let val = Math.abs(count);
    if (count <= -10) {
      for (let i = 0; i < 2000; i++) {
        stops.push([i, parseFloat(i / val)]);
      }
    } else if (count > -10 && count <= 0) {
      for (let i = 0; i < 2000; i++) {
        stops.push([i, i/(10-(10-val)*0.5)]);
      }
    } else if (count > 0 && count <= 10) {
      for (let i = 0; i < 2000; i++) {
        stops.push([i, i/((10-val+2)*0.5)]);
      }
    } else {
      for (let i = 0; i < 2000; i++) {
        stops.push([i,  i*((val-10)/10+1)]);
      }
    }
    return stops;
  }

  static roadBufferRange(count) {
    let stops = [];
    let val = Math.abs(count);
    if (count > 0) {
      for (let i = 0; i < 3000; i++) {
        stops.push([i, parseFloat(i * (1+val/10))]);
      }
    } else if (count < 0) {
      for (let i = 0; i < 3000; i++) {
        stops.push([i, parseFloat(i / val)]);
      }
    } else {
      for (let i = 0; i < 3000; i++) {
        stops.push([i, i]);
      }
    }
    return stops;
  }

  static setMidZoom(zoom) {

    let IntNum = parseInt(zoom);   //向下取整
    let remNum = zoom % 1 >= 0.5 ? 0.5 : 0;   //取整
    return IntNum + remNum;
  }

  static colorToRgba(colorStr) {
    //-------------------------------------
//十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    /*16进制颜色转为RGB格式*/
    let sColor = colorStr?colorStr.toLowerCase():null;
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = "#";
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      //处理六位的颜色值
      let sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
      }
      // return "rgb(" + sColorChange.join(",") + ")";
//或
      return "rgba(" + sColorChange.join(",") + ",0.6)";
    } else {
      return sColor;
    }

  }

  static  saveFile(data, filename) {
    let save_link = document.createElement('a');
    save_link.href = data;
    save_link.download = filename;

    let event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
  }
}

export default DateTimeHelper;
