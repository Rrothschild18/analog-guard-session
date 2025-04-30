import { Component, OnInit } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { RouteMeta } from "@analogjs/router";
import { authGuard } from "../guards/auth.guard";
import { injectTrpcClient } from "../../trpc-client";
import { debounceTime } from "rxjs";

export const routeMeta: RouteMeta = {
  title: "About Analog",
  canActivate: [authGuard],
};

@Component({
  selector: "example-app-home",
  template: `
    <div class="flex items-center justify-center mt-15">
      <h1>Dasboard</h1>
    </div>
  `,
})
export default class HomeComponent implements OnInit {
  readonly #trpc = injectTrpcClient();

  ngOnInit(): void {
    this.#trpc.auth.me
      .query()
      .pipe(debounceTime(2000))
      .subscribe((v) => console.log({ CMP_DATA_DELAY: v }));
  }
}
