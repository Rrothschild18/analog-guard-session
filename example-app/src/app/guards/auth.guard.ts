import { HttpClient } from "@angular/common/http";
import { injectTrpcClient } from "../../trpc-client";
import { Observable, map } from "rxjs";
import { inject } from "vitest";

export const authGuard = (route: any, state: any): Observable<boolean> => {
  const trpc = injectTrpcClient();

  return trpc.auth.me.query().pipe(
    map((data) => {
      console.log({ GUARD_DATA: data });
      // No data is retrieve from session

      if (!data) return false;
      //Save to Client State
      return true;
    })
  );
};
