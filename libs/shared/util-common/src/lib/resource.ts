import {Observable} from "rxjs"

export interface Resource<I, O> {
  execute(param: I): Observable<O>
}
