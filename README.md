# Memory

## Design

The index page for this web application displays a form. The purpose of this form is to specify the name of the game to be created, or if one already exists to join the according game. This application supports simultaneous games with different names, and consecuentially different game states. The approach to store game name pairs was to create an agent that holds backups of game name pairs. This app currently supports real-time updates to all users subscribed to the same game name. This was done by broadcasting state changes associated to that game name. Two checks where enforced to prevent race conditions during the time out. The Memory.Game module returns the state if the game state passed is locked; in the client-side, the lock was enforced to prevent that further messages reach the server and modify the state.

## Development Instructions

Prerequisites:

 * Erlang / OTP ~ 20.2
 * Elixir ~ 1.5
 * NodeJS ~ 9.4

To start your Phoenix server:

 * Install dependencies with `mix deps.get`
 * Install Node.js dependencies with `cd assets && npm install`
 * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Deployment Instructions

Instructions to deploy to an Ubuntu 16.04 VPS:

As root:

 * Install Erlang and Elixir packages.
 * Create a new Linux user account, "memory".
 * Add a nginx config for the new site. See "memory.nginx" for an example.

As the new user:

 * Install NodeJS through NVM.
 * Check out this git repository to ~/src/memory
 * Run the deploy script.
   * You may need to answer "Y" and press return.
 * Run the start script to start your server.

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix

Ready to run in production? Please
[check our deployment guides](http://www.phoenixframework.org/docs/deployment).

