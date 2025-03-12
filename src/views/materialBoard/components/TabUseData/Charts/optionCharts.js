export const optionCharts = {
  legend: {
    show: false,
    bottom: '2%',
    left: 'center'
  },
  color: ['#0C6FFF', '#45B9C2'],
  tooltip: {
    show: true,
    trigger: 'item',
    confine: false,
    formatter: '{b}: {d}%'
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '70%'],
      minAngle: 2,
      avoidLabelOverlap: true,
      animationType: 'scale',
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      data: [
      ],
      labelLine: {
        normal: {
          length: 0.001
        }
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{b}\n{d}%',
        fontSize: 10,
        length: 30
      }
    }
  ]
}
export const optionFunnel = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c}%'
  },
  color: ['#F98B8B', '#00E7FF', '#45B9C2', '#F5B700', '#3B86ED'],
  series: [
    {
      name: '漏斗模型',
      type: 'funnel',
      left: '20px',
      top: 30,
      bottom: 30,
      min: 0,
      max: 100,
      width: '60%',
      minSize: '5%',
      maxSize: '100%',
      sort: 'descending',
      silent: true,
      gap: 0,
      labelLine: {
        lineStyle: {
          width: 2,
          type: 'solid'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        label: {
          fontSize: 20
        }
      },
      data: []
    },
    {
      name: '漏斗模型',
      type: 'funnel',
      left: '20px',
      top: 30,
      bottom: 30,
      min: 0,
      max: 100,
      width: '60%',
      minSize: '5%',
      maxSize: '100%',
      sort: 'descending',
      silent: true,
      gap: 0,
      labelLine: {
        lineStyle: {
          width: 2,
          type: 'solid'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        label: {
          fontSize: 20
        }
      },
      data: []
    }
  ]
}

export const optionCategory = {
  legend: {
    bottom: '-4px'
  },
  grid: {
    top: 40,
    right: 0,
    bottom: 50,
    left: 50
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  color: ['#3B86ED', '#F5B700', '#45B9C2', '#00E7FF', '#F98B8B'],
  dataset: {
    source: []
  },
  xAxis: { type: 'category' },
  yAxis: {
    type: 'value',
    axisTick: {
      show: false
    },
    axisLabel: {
      show: true,
      formatter: '{value}%'
    },
    axisLine: {
      show: false
    }
  },
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [{ type: 'bar', barWidth: 10 }, { type: 'bar', barWidth: 10 }, { type: 'bar', barWidth: 10 }, { type: 'bar', barWidth: 10 }, { type: 'bar', barWidth: 10 }]
}
