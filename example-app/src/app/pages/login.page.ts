import { Component, inject } from "@angular/core";
import { injectTrpcClient } from "../../trpc-client";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { JsonPipe } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "example-app-home",
  template: `
    <div class="flex items-center justify-center mt-15">
      <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center text-gray-900">Login</h2>
        {{ signInForm.value | json }}
        <form class="space-y-4" (ngSubmit)="login()" [formGroup]="signInForm">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <input
              id="email"
              type="email"
              formControlName="email"
              required
              class="w-full px-3 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <input
              id="password"
              type="password"
              formControlName="password"
              required
              class="w-full px-3 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  `,
  imports: [ReactiveFormsModule, JsonPipe],
})
export default class HomeComponent {
  readonly #trpc = injectTrpcClient();
  readonly #router = inject(Router);

  protected signInForm = new FormGroup({
    email: new FormControl("", {}),
    password: new FormControl("", {}),
  });

  login() {
    const { email = "", password = "" } = this.signInForm.value;

    this.#trpc.auth.signIn
      .mutate({
        email: this.signInForm.value.email!,
        password: this.signInForm.value.password!,
      })
      .subscribe(() => this.#router.navigate(["dashboard"]));
  }
}
