// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. '});

    const { code, client_id, redirect_uri } = req.body;

    try  {
        const request = `https://api.twitter.com/2/oauth2/token`;

        const form = new FormData();
        form.set('code', code);
        form.set('client_id', client_id);
        form.set('grant_type', 'authorization_code');
        form.set('redirect_uri', redirect_uri);
        form.set('code_verifier', 'challenge');

        console.log({
            code,
            client_id,
            redirect_uri
        });

        const response = await fetch(request, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${code}`
            },
            body: form
        });
        const json = await response.json();
        console.log({ json });

        return res.status(200).json({ code, client_id, redirect_uri, json });
    } catch (error: any) {
        return res.status(400).json({ error: error?.message ?? 'Unknown error.'})
    }

}
