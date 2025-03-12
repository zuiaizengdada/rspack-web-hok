//此函数使时间按照指定的字符串样式输出
//date是当前的系统时间
export function dateFormat(date, str) {
  //获取当前的年,月,日,小时,分,秒
  var year = date.getFullYear()
  //因为系统上的月份1-12分别为0-11,所以输出时应+1显示
  var month = addZero(date.getMonth() + 1)
  var day = addZero(date.getDate())
  var hour = date.getHours()
  var min = date.getMinutes()
  var sec = date.getSeconds()
  //如果单个0-9的秒数显示起来不好看,可以使其为0-9时在其开头添加个0为00-09
  //三元运算符,如果其值<10,则头部添加"0",否则按照原样不变
  // sec = sec < 10 ? "0" + sec : sec;

  //将字符串中的yyyy,mm,day等用刚刚获取的年,月,日等替换
  return str
    .replace('yyyy', year)
    .replace('mm', month)
    .replace('dd', day)
    .replace('hh', hour)
    .replace('msa', min)
    .replace('ss', sec)
}

export function addZero(sec) {
  return (sec = sec < 10 ? '0' + sec : sec)
}

//获取当前月份一共有多少天
export function getDays(date) {
  //随意临时设置一个时间,但日期最好<=28，否则日期可能会溢出
  var tempDate = new Date('2000-01-01')
  //获取系统的年,月
  var year = date.getFullYear()
  var month = date.getMonth()
  //将临时设置的时间用获得的年,月表示
  tempDate.setFullYear(year)
  //若当前月份为九月,使其+1为10月
  tempDate.setMonth(month + 1)
  //将日期设置为0,会自动向前进1,所以在此时获取当前日期,就是9月的最后一天
  tempDate.setDate(0)
  return tempDate.getDate()
}
//获取当月第一天是星期几
export function firstWeek(date) {
  //随意设置时间
  var tempDate = new Date('2000-01-01')
  //获取当前系统的年,月
  var year = date.getFullYear()
  var month = date.getMonth()
  //将临时设置的时间用获得的年,月表示
  tempDate.setFullYear(year)
  tempDate.setMonth(month)
  //因为临时设置的日期为1,所以不用设置,直接返回当前时间的日期
  return tempDate.getDay()
}
//获得当月的上一个月总共有多少天
export function prevMonthDays(date) {
  var tempDate = new Date('2000-01-01')
  var year = date.getFullYear()
  var month = date.getMonth()
  //获取当前的年,月,并将日期设置为0
  tempDate.setFullYear(year)
  tempDate.setMonth(month)
  tempDate.setDate(0)
  //此时日期自动向上个月进1,所以现在获取的日期即为上一个月的最后一天
  return tempDate.getDate()
}
