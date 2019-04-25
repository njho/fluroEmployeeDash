## Developer Setup

- Use VSCode as an IDE
- Add extensions: ESLint, Prettier Now
- Use the following User Settings:

```
"editor.tabSize": 2,
"editor.formatOnSave": true,
"prettier.singleQuote": true,
"prettier.jsxSingleQuote": true,
"eslint.autoFixOnSave": true,
"prettier.useTabs": false,
"prettier.tabWidth": 2
```

# HOCS

## withAuthentication

Used for user Authorization and identification of user roles combining:

- User Roles
- Database User Roles

Please use the `withAuthorization` HOC to declare the `condition` on each `Route` or page which requires authentication:

- `/dashboard/...`

### Example Conditions

```
const condition = authUser => !!authUser;
// role-based authorization
const condition = authUser => authUser.role === 'ADMIN';
// permission-based authorization
const condition = authUser => authUser.permissions.canEditAccount;
```

### Constants

Constants are defined for the following:

- Routes
- Roles

### Brand Onboarding

- Square brand image -> Upload into logoUrl on onboarding

# GUIDE

## How do I control which routes a user has access to??

Take a look at the `withAuthorization` HOC. When se use that, we are able to pass a condition which can be used to authenticate or redirect that individual elsewhere.

```
const condition = authUser => !!authUser;

export default withRouter(withAuthorization(condition)(Dashboard));
```
