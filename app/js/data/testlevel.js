window.TestLevel = {
  name:'Test Level',
  spawn: [1.5, 2, 1],
  materials:{
    'flat-red':{
      type:'lambert',
      color: 0xdd3311
    },
    'flat-green':{
      type:'lambert',
      color: 0x33aa11
    },
    'floor-grid':{
      type: 'lambert',
      url: '/textures/floor-grid.png'
    },
    'wall-grid':{
      type: 'lambert',
      url: '/textures/wall-grid.png'
    },
    'blue-grid':{
      type: 'lambert',
      url: '/textures/floor-grid.png',
      color: 0xaaaaff
    },
    'orange-grid':{
      type: 'lambert',
      url: '/textures/floor-grid.png',
      color: 0xff9900
    },
    'trigger':{
      type:'lambert',
      color: 0x2288dd,
      transparent: true,
      opacity: 0.3
    },
    'triggered':{
      type:'lambert',
      color: 0x22ff44,
      transparent: true,
      opacity: 0.3
    }
  },
  entities:[
    {
      type:'light',
      position: [0, 15, 1],
      color: 0xffffff,
      intensity: 1,
      distance: 100
    },
    {
      type:'light',
      position: [-14, 15, 1],
      color: 0xffffff,
      intensity: 1,
      distance: 30
    },
    {
      type:'light',
      position: [14, 15, 1],
      color: 0xffffff,
      intensity: 1,
      distance: 30
    },
    {
      type:'box',
      geometry: {width:30, height:0.2, depth:20},
      position: [0, 0, 0],
      material: 'floor-grid'
    },
    {
      type:'box',
      geometry: {width:0.2, height:2, depth:20},
      position: [-15, 1, 0],
      material: 'wall-grid'
    },
    {
      type:'box',
      geometry: {width:0.2, height:2, depth:20},
      position: [15, 1, 0],
      material: 'wall-grid'
    },
    {
      type:'box',
      geometry: {width:30, height:2, depth:0.2},
      position: [0, 1, -10],
      material: 'wall-grid'
    },
    {
      type:'box',
      geometry: {width:30, height:2, depth:0.2},
      position: [0, 1, 10],
      material: 'wall-grid'
    },
    {
      type:'box',
      geometry: {width:1, height:1, depth:1},
      position: [-12, 2, 8],
      material: 'flat-red'
    },
    {
      type:'box',
      geometry: {width:1, height:1, depth:1},
      position: [12, 2, 8],
      material: 'flat-red'
    },
    {
      type:'box',
      geometry: {width:1, height:1, depth:1},
      position: [-6, 1, 8],
      material: 'flat-red'
    },
    {
      type:'box',
      geometry: {width:1, height:1, depth:1},
      position: [-3, 1, 4],
      material: 'flat-green'
    },
    {
      type:'prism',
      geometry: {radius:1.5, length:10},
      position: [12, 0.5, -3.3],
      rotation: [0.2, 0.2, 0],
      material: 'blue-grid'
    },
    {
      type:'box',
      geometry: {width:6, height:1, depth:2},
      position: [10, 0.5, -8.9],
      material: 'orange-grid'
    },
    {
      type:'box',
      geometry: {width:4, height:1, depth:2},
      position: [11, 1.5, -8.9],
      material: 'orange-grid'
    },
    {
      type:'box',
      geometry: {width:2, height:1, depth:2},
      position: [12, 2.5, -8.9],
      material: 'orange-grid'
    },
    {
      type:'trigger',
      event:'detection',
      geometry: {width:2, height:0.5, depth:2},
      position: [0, 1, 0]
    }
  ]
};
