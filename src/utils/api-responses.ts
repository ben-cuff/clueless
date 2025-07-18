const UnknownServerError = new Response(
  JSON.stringify({ error: 'Internal Server Error' }),
  {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  }
);

const ForbiddenError = new Response(JSON.stringify({ error: 'Unauthorized' }), {
  status: 403,
  headers: { 'Content-Type': 'application/json' },
});

function get200Response(data: object) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
function get201Response(data: object) {
  return new Response(JSON.stringify(data), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

function get400Response(error: string) {
  return new Response(JSON.stringify({ error }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

function get401Response(error: string) {
  return new Response(JSON.stringify({ error }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

function get404Response(error: string) {
  return new Response(JSON.stringify({ error }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}

function get409Response(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 409,
    headers: { 'Content-Type': 'application/json' },
  });
}

function get500Response(error: string) {
  return new Response(JSON.stringify({ error }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

export {
  ForbiddenError,
  get200Response,
  get201Response,
  get400Response,
  get401Response,
  get404Response,
  get409Response,
  get500Response,
  UnknownServerError,
};
