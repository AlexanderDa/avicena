
import Vue from 'vue'
import Notify from '@/components/action/Notify'
export default interface Service<E> {
  create(element: E): Promise<E>
  count(): Promise<number>
  find(): Promise<E[]>
  findById(id: number): Promise<E>
  updateById(element: E): Promise<boolean>
  // replaceById(id: number, element: E): Promise<void>
  deleteById(id: number): Promise<boolean>

  formBody(element: E): E
}
export function errorService (error: any): void {
  const notify: Notify = new Notify()

  switch (error.status) {
    case 401:
      // @ts-ignore
      Vue.dialog.alert({
        title: 'Su sesión expiró',
        body: 'No se guardó ninguna acción, para continuar por favor inicie sesión.'
      }).then(() => {
        window.location.href = '/'
      })
      break
    case 409:
      notify.error('El elemento es usado.')
      break

    case 422:
      notify.error('El cuerpo de la solicitud no es válido.')
      break

    default:
      notify.error('Error interno.')
      break
  }
}
