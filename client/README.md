# 🧪 TanStack Query – `useMutation` Notes

## 📌 What is `useMutation`?

`useMutation` is used for actions that **change data on the server**.

### Examples:
- Login / Register
- Create / Update / Delete data
- Submit forms
- Logout

> If the request **modifies server state**, use `useMutation`.

---

## ❌ What `useMutation` is NOT for

- Fetching page data
- GET requests for displaying content
- Routing

👉 For fetching data → use **route loaders** or **`useQuery`**

---

## ✅ When to use `useMutation`

Use it when:
- You send **POST, PUT, PATCH, DELETE**
- You submit a form
- You need **success / error handling**
- You want **loading states**

---

## 🧠 Basic Structure

```ts
const mutation = useMutation({
  mutationFn: apiFunction,
  onSuccess: (data) => {},
  onError: (error) => {},
});
```

## 🧩 Example: Login Mutation
```ts
const loginMutation = useMutation({
  mutationFn: authApi.login,

  onSuccess: (response) => {
    localStorage.setItem("token", response.token);
    toast.success("Login successful");
    navigate({ to: "/dashboard" });
  },

  onError: (error) => {
    toast.error("Login failed");
  },
});
```
## Trigger mutation
```ts
loginMutation.mutate(formData);
🔄 mutate vs mutateAsync
mutate
Fire-and-forget
```

## Handle result in onSuccess

```ts
mutation.mutate(data);
mutateAsync
Await result
```
## Useful inside async / await

```ts
await mutation.mutateAsync(data);
```

## 📊 Important States
State	Meaning
isPending	Request in progress
isSuccess	Request succeeded
isError	Request failed
error	Error object
data	Success response

Example
```ts 
if (mutation.isPending) {
  // show loader
}
```
## 🔐 Common Real-World Pattern (Auth)

| Task	         |      Tool         |
|----------------|-------------------|
| Page routing	 |   TanStack Router |
| Fetch page data|	Route loader     |
| Submit form	   |   useMutation     |
| Auth check	   |   beforeLoad      |
| Toast feedback |  Sonner           |

## 🚫 Common Mistakes
❌ Using useMutation for GET requests

❌ Putting navigation logic inside components instead of onSuccess

❌ Sending invalid form data (skipping validation)

## ✅ Best Practices
✔ Validate input before mutation (Zod / React Hook Form)

✔ Handle redirects in onSuccess

✔ Keep mutation logic in custom hooks

✔ Keep UI components dumb

🧠 Simple Rule to Remember
```graphql
Fetching data  → Query / Loader
Changing data  → Mutation
```
## 🏁 Summary
useMutation is for server-side changes

Perfect for login, forms, CRUD

Works best with TanStack Router + RHF

Essential for real-world React apps