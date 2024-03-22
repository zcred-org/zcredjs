import { suite } from "uvu";
import * as a from "uvu/assert";
import {
  IEC,
  isIECode,
  isJsonIssuerException,
  isJsonSubjectException,
  isJsonVerifierException,
  isJsonZcredException,
  isSECode,
  IssuerException,
  isVECode,
  JsonIssuerException,
  JsonSubjectException,
  JsonVerifierException,
  SEC,
  SubjectException,
  VEC,
  VerifierException,
  ZcredException
} from "../../src/index.js";

const test = suite("exception types test");

test("issuer exception code", () => {
  a.ok(isIECode(10000), "1");
  a.not.ok(isIECode(21000), "2");
});

test("subject exception code", () => {
  a.ok(isSECode(20000), "1");
  a.not.ok(isSECode(30000), "2");
});

test("verifier exception code", () => {
  a.ok(isVECode(30000), "1");
  a.not.ok(isVECode(10000), "2");
});

test("json zcred exception", () => {
  a.ok(isJsonZcredException({
    code: 10000,
    message: "one two three"
  }), "1");

  a.ok(isJsonZcredException({
    code: 11001
  }), "2");

  a.not.ok(isJsonZcredException({
    code: 0,
    message: "123"
  }), "3");

  a.not.ok(isJsonZcredException({
    code: 10000,
    message: 1
  }), "4");

  a.not.ok(isJsonZcredException({}), "5");
});

test("json issuer exception", () => {
  a.ok(isJsonIssuerException({
    code: 10000,
    message: "123123"
  } satisfies JsonIssuerException), "1");

  a.ok(isJsonIssuerException({
    code: 11001
  } satisfies JsonIssuerException), "2");

  a.not.ok(isJsonIssuerException({
    code: 0,
  }), "3");

  a.not.ok(isJsonIssuerException({}), "4");
});

test("json subject exception", () => {
  a.ok(isJsonSubjectException({
    code: 20000,
    message: "123123"
  } satisfies JsonSubjectException), "1");

  a.ok(isJsonSubjectException({
    code: 20000
  } satisfies JsonSubjectException), "2");

  a.not.ok(isJsonSubjectException({
    code: 0,
  }), "3");

  a.not.ok(isJsonSubjectException({}), "4");
});

test("json verifier exception", () => {
  a.ok(isJsonVerifierException({
    code: 30000,
    message: "123123"
  } satisfies JsonVerifierException), "1");

  a.ok(isJsonVerifierException({
    code: 30000
  } satisfies JsonVerifierException), "2");

  a.not.ok(isJsonVerifierException({
    code: 0,
  }), "3");

  a.not.ok(isJsonVerifierException({}), "4");
});

test("zcred exception", () => {
  const exception = new ZcredException(VEC.NO_VERIFIER);
  a.instance(exception, ZcredException, "1");
  a.ok(isJsonZcredException(exception), "2");
});

test("issuer exception", () => {
  const exception = new IssuerException(IEC.NO_ISSUER);
  a.instance(exception, ZcredException, "1");
  a.instance(exception, IssuerException, "2");
  a.ok(isJsonIssuerException(exception), "3");
  a.ok(isJsonZcredException(exception), "4");
});

test("subject exception", () => {
  const exception = new SubjectException(SEC.REJECT);
  a.instance(exception, ZcredException, "1");
  a.instance(exception, SubjectException, "2");
  a.ok(isJsonSubjectException(exception), "3");
  a.ok(isJsonZcredException(exception), "4");
});

test("verifier exception", () => {
  const exception = new VerifierException(VEC.NO_VERIFIER);
  a.instance(exception, ZcredException, "1");
  a.instance(exception, VerifierException, "2");
  a.ok(isJsonVerifierException(exception), "3");
  a.ok(isJsonZcredException(exception), "4");
});

test.run();