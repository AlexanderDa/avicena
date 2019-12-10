export default interface PageService<E> {

    created():void
    initHeader(): void

    createElement():void
    findElements():void
    updateElement():void
    deleteElement(element:E):void

    toEditElement(element:E):void
    submit():void
    close():void
  }
