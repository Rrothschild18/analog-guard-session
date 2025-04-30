import { Component } from "@angular/core";
import { AsyncPipe, DatePipe, NgFor, NgIf } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { shareReplay, Subject, switchMap, take } from "rxjs";
import { waitFor } from "@analogjs/trpc";
import { injectTrpcClient } from "../../trpc-client";
import { Note } from "../../note";
import { RouterLink } from "@angular/router";

@Component({
  selector: "example-app-analog-welcome",

  imports: [AsyncPipe, FormsModule, NgFor, DatePipe, NgIf, RouterLink],
  host: {
    class:
      "flex min-h-screen flex-col text-zinc-900 bg-zinc-50 px-4 pt-8 pb-32",
  },
  template: `
    <main class="flex-1 mx-auto">
      <h1>HomePage!</h1>

      <div class="flex flex-col gap-3">
        <button
          routerLink="login"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>

        <button
          routerLink="dashboard"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Dashboard
        </button>
      </div>
    </main>
  `,
})
export class AnalogWelcomeComponent {
  private _trpc = injectTrpcClient();
  public triggerRefresh$ = new Subject<void>();
  public notes$ = this.triggerRefresh$.pipe(
    switchMap(() => this._trpc.note.list.query()),
    shareReplay(1)
  );
  public newNote = "";

  constructor() {
    void waitFor(this.notes$);
    this.triggerRefresh$.next();
  }

  public noteTrackBy = (index: number, note: Note) => {
    return note.id;
  };

  public addNote(form: NgForm) {
    if (!form.valid) {
      form.form.markAllAsTouched();
      return;
    }
    this._trpc.note.create
      .mutate({ note: this.newNote })
      .pipe(take(1))
      .subscribe(() => this.triggerRefresh$.next());
    this.newNote = "";
    form.form.reset();
  }

  public removeNote(id: number) {
    this._trpc.note.remove
      .mutate({ id })
      .pipe(take(1))
      .subscribe(() => this.triggerRefresh$.next());
  }
}
