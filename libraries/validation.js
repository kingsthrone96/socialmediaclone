class Validation {
  static schema = {};
  static requestBody = {};
  static errors = [];

  static validate(requestBody, schema, reqKey, schemaKey) {
    if (typeof requestBody[reqKey] !== typeof schema[schemaKey]["type"]) {
      Validation.errors.push({
        key: reqKey,
        errorMessage: `${reqKey} must be a type of ${schema[schemaKey]["type"]}`,
      });
    } else {
      const pattern = /[^\w+\s?]|\d+/g;
      if (
        typeof requestBody[reqKey] === "string" &&
        schema[schemaKey][`isAbsolute`] &&
        pattern.test(requestBody[reqKey])
      ) {
        const invalidPattern = `${requestBody[reqKey]}`.match(pattern);
        Validation.errors.push({
          key: reqKey,
          errorMessage: `${reqKey} must not contain numbers & special characters (${invalidPattern})`,
        });
      }
    }

    if (
      requestBody[reqKey].length < schema[schemaKey]["min"] &&
      requestBody[reqKey].length > 0
    ) {
      Validation.errors.push({
        key: reqKey,
        errorMessage: `${reqKey} must be at least ${schema[schemaKey]["min"]} characters`,
      });
    }
  }

  constructor() {
    Validation.schema = {};
    Validation.requestBody = {};
    Validation.errors = [];
  }

  /**
   *
   * @param {{}} schema
   */
  setSchema(schema) {
    if (!schema) throw new Error("Schema was not provided");
    Validation.schema = schema;
  }

  /**
   *
   * @param {{}} requestBody
   */
  compare(requestBody) {
    if (!requestBody) throw new Error("Request Body was not provided");
    Validation.requestBody = requestBody;

    let reqKeys = Object.keys(Validation.requestBody);
    let schemaKeys = Object.keys(Validation.schema);

    schemaKeys.forEach((key) => {
      if (Validation.schema[key]["required"]) {
        if (!Validation.requestBody[key]) {
          Validation.errors.push({
            key: key,
            errorMessage: `${key} is required`,
          });
        }
      }
    });

    reqKeys.forEach((reqKey) => {
      schemaKeys.forEach((schemaKey) => {
        if (reqKey === schemaKey) {
          Validation.validate(
            Validation.requestBody,
            Validation.schema,
            reqKey,
            schemaKey
          );
        }
      });
    });
  }

  get errors() {
    if (!Validation.errors.length) return null;
    return Validation.errors;
  }

  get validatedBody() {
    if (!Validation.errors.length) return Validation.requestBody;
    return null;
  }
}

module.exports = Validation;
