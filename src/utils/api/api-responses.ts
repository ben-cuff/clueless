function createResponse(
  status: number,
  body: object,
  headers: HeadersInit = { 'Content-Type': 'application/json' }
) {
  return new Response(JSON.stringify(body), { status, headers });
}

const UnknownServerError = createResponse(500, {
  error: 'Internal Server Error',
});

const ForbiddenError = createResponse(403, { error: 'Unauthorized' });

function get200Response(data: object) {
  return createResponse(200, data);
}

function get201Response(data: object) {
  return createResponse(201, data);
}

function get400Response(error: string) {
  return createResponse(400, { error });
}

function get401Response(error: string) {
  return createResponse(401, { error });
}

function get404Response(error: string) {
  return createResponse(404, { error });
}

function get409Response(error: string) {
  return createResponse(409, { error });
}

function get500Response(error: string) {
  return createResponse(500, { error });
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
