import { validateRedirectResponse } from "../saml/node-saml.js";
import { printSamlRequestUrl } from "../utils.js";

const url = new URL(
  "https://localhost.dev:3001/auth/saml/logout?SAMLResponse=hVNdb9owFP0rkfec%2BINAwSJU2zo0NFqpQD%2FGy%2BQ6F7CW2FGuQ%2Bi%2Fn0NH10kre%2FT1Offcc3w9vjyURbSHGo2zGeEJIxFY7XJjtxm5W03jIYnQK5urwlnIyDMguZyMUZVFJedu6xq%2FAKycRYhCK4syRxOoO%2B8rSWnbtknbS1y9pYIxRtmIBlQH%2BUB%2B44PcO3BOWdrBA%2BIV3QlnpKmtdAoNSqtKQOm1XH68nkuRMKkQofbBzltKdZ5T1c477YoT5dBn7L%2BMjSlCUXlfm6fGg3wMpNcGaN419Xg9X%2BodlCo2totWA4lmVxkxeczb9T7X61KI6cLfqe%2Btv1kWt5%2FictGPH25Var6oh69F%2FS0Q7Cn2lcvIjxTSgeAXIu2zHuNspHugh0Pog%2BC55gM%2BYBc67Y%2BeSHR%2FemvRvfUMsYHZcQwfSkykMeexECvOZTqQXKxJdAXojVX%2ByOo8YTBVOK2KnUOf5LCXvc6XavyOdmGHy24vyMuayKNGHU1dXSp%2FPtWuEmLYHKFhM7zxz2Ry0qxqsysUgjWQNNUeN%2BaQbN0%2BwZ%2FUqZJuIB%2FTN4qnLV165Rv8%2B%2FTZ5RDdq6KB8wPhES2XjdaASOjkReFPU%2FqvnzD5BQ%3D%3D&SigAlg=http%3A%2F%2Fwww.w3.org%2F2001%2F04%2Fxmldsig-more%23rsa-sha256&Signature=Jhy%2BXdcPS8CfLCR0Gxo5CdW5PE74PmSC0kKdzq0jOqXgNTZElb3Ce6NBtPZzYdNy1EePDKqJRTbgD1YDBYkqpYIFrnuNPQT1F2pBs3AkcxqXi%2FIBrvo6MD6ylMfu3xXtKyQ7vAl8mSH16yzQcjPoP%2FDmyhikYnMFDmoPmOSEgxn7gMwCxO5enjzRDzE1sqVf9yuqoomg0xR%2FftltUyCB1mg6Z9WwKM6rk8rky89GhG%2BAWu3Pmvi4xhIaUZdv1WTOT7kAYvo6tqrN0KuaTpP6X89GI0PdfFVXvREua6YY%2BGAPVByleqMZ1Xfw4dLFDqj6tA45NG%2Ffb3yL4QKmFLthzQ%3D%3D"
);

printSamlRequestUrl(url.toString());

const query = url.searchParams;

console.log(
  await validateRedirectResponse(
    Object.fromEntries(query.entries()),
    query.toString()
  )
);
