import {HttpInterceptorFn} from "@angular/common/http"
import {TestBed} from "@angular/core/testing"

import {pocketbaseApiInterceptor} from "./pocketbase-api.interceptor"

describe('pocketbaseApiInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => pocketbaseApiInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
