import React, { Component } from 'react'
import API from '../../../utils/api'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  Toast
} from 'antd-mobile'

import NavHeader from '../../../components/NavHeader'
import HousePackge from '../../../components/HousePackage'

import styles from './index.module.css'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props) // 调用父类的方法,改变this的指向,拿到父类的值

    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community: {
        name: '',
        id: ''
      },
      // 价格
      price: '',
      // 面积
      size: '',
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }

  // 处理change事件
  handleChange = (name, val) => {
    console.log(name, val)
    this.setState({
      [name]: val
    })
  }
  // 处理图片
  handleImg = (files) => {
    console.log(files)
    this.setState({
      tempSlides: files // 图片文件数组,元素为对象,必须包含url
    })
  }
  // 点击提交按钮,发送请求
  addHouse = async () => {
    // 解构
    const {
      tempSlides,
      title,
      description,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community
    } = this.state
    // 1.1发送上传图片的请求,拿到图片路径
    if (tempSlides.length === 0) return
    const fd = new FormData()
    tempSlides.forEach(item => {
      fd.append('file', item.file) // item.file是图片对象
    })
    // 发送上传图片的请求 注意的是: 图片是一张一张上传的
    const res = await API.post('/houses/image', fd, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log('上传图片的结果', res)
    if (res.data.status === 200) {
      Toast.success('图片上传成功', 1.5)
      let houseImg = res.data.body.join('|') // 将数组拼接成字符串
      // 发送发布文章的请求
      const result = await API.post('/user/houses', {
        title,
        description,
        oriented,
        supporting,
        price,
        roomType,
        size,
        floor,
        community: community.id,
        houseImg
      })

      console.log('发布房源的结果', result)
      if (result.data.status === 200) {
        // 房源发布成功
        Toast.success('房源发布成功', 1.5, () => {
          // 跳转到房源管理列表页
          this.props.history.replace('/rent')
        })
      } else {
        // 房源发布失败
        Toast.fail('房源发布失败', 1.5)
      }

    } else {
      Toast.fail('上传图片失败', 1.5)
    }
  }
  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title,
      size
    } = this.state

    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={this.onCancel}>发布房源</NavHeader>

        <List
          className={styles.header}
          renderHeader={() => '房源信息'}  // 上面的标题
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'} // 右边的内容
            arrow="horizontal"                        // 箭头的方向
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          <InputItem placeholder="请输入租金/月" extra="￥/月" value={price} onChange={(val) => this.handleChange('price', val)}>
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem placeholder="请输入建筑面积" extra="㎡" value={size} onChange={(val) => this.handleChange('size', val)}>
            建筑面积
          </InputItem>
          <Picker data={roomTypeData} value={[roomType]} cols={1} onChange={(val) => this.handleChange('roomType', val[0])}>
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker data={floorData} value={[floor]} cols={1} onChange={(val) => this.handleChange('floor', val[0])}>
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker data={orientedData} value={[oriented]} cols={1} onChange={(val) => this.handleChange('oriented', val[0])}>
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={(val) => this.handleChange('title', val)}
          />
        </List>

        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}  // 图片文件数组,元素为对象,必须包含url
            multiple={true}     // 支持多张
            className={styles.imgpicker}
            onChange={this.handleImg}
          />
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackge select onSelect={(val) => {
            this.setState({
              supporting: val.join('|')
            })
          }} />
        </List>

        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={val => this.handleChange('description', val)}
          />
        </List>

        <Flex className={styles.bottom} style={{ textAlign: 'center' }}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
  componentDidMount() {
    // 页面一进来,拿到传递过来的值
    if (this.props.location.state) {
      this.setState({
        community: this.props.location.state
      })
    }
  }
}