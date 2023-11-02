export type Credentials = {
  principalId: string;
  password: string;
};

const TOKEN_PREFIX = 'Basic ';
const extractToken = (rawToken: string) => rawToken.slice(TOKEN_PREFIX.length);

const decodeToken = (token: string) => {
  return JSON.parse(
    Buffer.from(extractToken(token), 'base64').toString('utf-8')
  );
};

export const getCredentials = (token: string): Credentials => {
  const rawCredentials = decodeToken(token);

  const [principalId, password] = Object.entries(rawCredentials)[0];

  return {
    principalId,
    password: password as string
  };
};

export const getIsAuthorized = ({
  principalId,
  password
}: Credentials): boolean =>
  process.env[principalId] && process.env[principalId] === password;

export const getResponse = (
  credentials: Credentials,
  isAuthorized: boolean,
  methodArn: string
) => ({
  principalId: credentials.principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: isAuthorized ? 'Allow' : 'Deny',
        Resource: methodArn
      }
    ]
  }
});
