import CutIcon from '../../../icons/fenge_icon.svg'
import MarkIcon from '../../../icons/biaoqian_icon2.svg'
import NextIcon from '../../../icons/chongzuo_icon_s.svg'
import PrevIcon from '../../../icons/chexiao_icon_s.svg'
import DeleteIcon from '../../../icons/action_del_icon.svg'
import FrameIcon from '../../../icons/action_frame_icon.svg'

import IconXifuN from '../../../icons/zidongcixi_icon_n.svg'
import IconXifuS from '../../../icons/zidongcixi_icon_s.svg'
import IconYulanN from '../../../icons/xifuzhou_icon_n.svg'
import IconYulanS from '../../../icons/xifuzhou_icon_s.svg'

export const iconList = [
  { src: PrevIcon, type: 'prev', title: '撤销', disable: true, keybord: 'Ctrl + Z' },
  {
    src: NextIcon,
    type: 'next',
    title: '恢复',
    disable: true,
    keybord: 'Ctrl + Shift + Z'
  },
  { src: MarkIcon, type: 'mark', title: '内容标记', disable: true, display: true, keybord: 'Ctrl + F' },
  { src: CutIcon, type: 'cut', title: '切片', keybord: 'C' },
  { src: DeleteIcon, type: 'delete', title: '删除', disable: true, keybord: 'Delete' },
  { src: FrameIcon, type: 'frame', title: '帧定格', disable: true }
]

export const rightIconList = [
  { src: IconXifuN, type: 'autoAbsorb', title: '开启自动吸附', keybord: 'N', isActive: false, show: false },
  { src: IconYulanN, type: 'previewLine', title: '开启预览轴', keybord: 'S', isActive: false, show: true }
]

export const rightIconListActive = [
  { src: IconXifuS, type: 'autoAbsorb', title: '关闭自动吸附', keybord: 'N', isActive: true },
  { src: IconYulanS, type: 'previewLine', title: '关闭预览轴', keybord: 'S', isActive: true }
]
