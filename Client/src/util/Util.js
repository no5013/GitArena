export default class {
  static distanceBetweenPoint (x1, y1, x2, y2) {
    return Math.sqrt(
      Math.pow(x1-x2,2) + Math.pow(y1-y2,2)
    )
  }

  static directionOfVector (x1, y1, x2, y2) {
    let vector_x = x1 - x2
    let vector_y = y1 - y2
    if(Math.abs(vector_x)> Math.abs(vector_y)){
      if(vector_x >=0){
        return "left"
      }
      return "right"
    }else{
      if(vector_y >=0){
        return "up"
      }
      return "down"
    }
  }

  static getSurroundCoordinate (x, y) {
    return [
      {
        x:x+1,
        y:y
      },
      {
        x:x-1,
        y:y
      },
      {
        x:x,
        y:y+1
      },
      {
        x:x,
        y:y-1
      }
    ]
  }
}
