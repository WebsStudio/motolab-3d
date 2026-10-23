<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules

- Public lead forms (booking requests) submit through a `createServerFn` that validates with Zod and inserts with the server publishable client; the table keeps an insert-only policy for `anon` and grants no read to `anon`, so visitors cannot list other people's submissions and the owner reads them from the Cloud database view. Why: a public form must not become a public read endpoint.
- Anti-spam for those forms is a `SECURITY DEFINER` rate-check function called over RPC, not a SELECT policy for `anon`. Why: the visitor needs to ask "am I already in?" without being able to read the table.
- Form field rules live in `src/lib/schemas.ts`, shared by the browser form and the server function, and each rule has an assertion in `src/test/booking-request.test.ts`. Why: client and server must never disagree about what a valid submission is.

