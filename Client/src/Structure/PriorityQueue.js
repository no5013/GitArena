export default class {
  constructor ({comparator}){
    this.comparator = comparator
    this.priority_queue = []
  }

  queue(item) {
    if(this.priority_queue.length<=0){
      this.priority_queue.push(item)
    }
    else{
      this.priority_queue.reverse()
      for(let i=0; i<this.priority_queue.length; i++){
        var queue_item = this.priority_queue[i]
        var compare_value = this.comparator(item, queue_item)
        if(compare_value<0){
          if(i == this.priority_queue.length-1){
            this.priority_queue.splice(i+1, 0, item)
            break;
          }
        }
        else{
          this.priority_queue.splice(i, 0, item)
          break;
        }
      }
      this.priority_queue.reverse()
    }
  }

  dequeue() {
    let item = this.priority_queue.shift()
    return item
  }

  removeObjectFromQueue(remove_object){
    for(let i=0; i<this.priority_queue.length-1; i++){
      if(this.priority_queue[i].equals(remove_object)){
        this.priority_queue.splice(i,1)
        break;
      }
    }
  }
}
