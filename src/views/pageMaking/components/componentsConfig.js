export const basicComponents = [
  {
    type: 'picture',
    icon: 'icon_page_image',
    name: '图片',
    options: {
      style: {
        gutter: 12,
        leftAndRightSpacing: 12,
        topAndBottomSpacing: 0
      },
      sortType: '1',
      dataSource: []
    }
  },
  {
    type: 'lecturer',
    icon: 'icon_page_lecturer',
    name: 'IP',
    options: {
      style: {
        gutter: 12,
        leftAndRightSpacing: 12,
        topAndBottomSpacing: 0
      },
      sortType: '1',
      backgroundStyle: {
        backgroundType: 1,
        backgroundVal: '',
        imageUrl: []
      },
      showNameType: 1,
      showIntroductionType: 1,
      dataSource: []
    }
  },
  {
    type: 'course',
    icon: 'icon_page_course',
    name: '课程',
    options: {
      style: {
        gutter: 12,
        leftAndRightSpacing: 12,
        topAndBottomSpacing: 0
      },
      sortType: '1',
      backgroundStyle: {
        backgroundType: 1,
        backgroundVal: '',
        imageUrl: []
      },
      courseMaxlen: 3,
      showNameType: 1,
      showIntroductionType: 1,
      isShowCourseGroupName: true,
      isShowGoodsScore: true,
      isShowGoodsPopularity: false,
      tabsKey: [],
      dataSource: []
    }
  }
]
