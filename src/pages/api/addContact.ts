// Generated with CLI
import { NextApiRequest, NextApiResponse } from 'next';
import { getXataClient } from "@/xata";
import { IncomingForm } from 'formidable';
import fs from 'fs';
import util from 'util';



const xata = getXataClient();

export const config = {
    api: {
        bodyParser: false,  // Important to disable the default body parser
    },
};

/* export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
      try {
          const { first_name, last_name, phone_number, email, image_url, image } = req.body;
          console.log("Received in API route:", { first_name, last_name, phone_number, email, image_url, image });
          console.log("Received image ", image.name, " with URL ", image.url)

          if (!first_name || !last_name || !phone_number || !email) {
              return res.status(400).json({ error: 'Required fields are missing.' });
          }

          const record = await xata.db.contacts.create({
              first_name,
              last_name,
              phone_number,
              email,
              image_url, 
              image // this URL is from Xata, received after uploading the image
          });

          return res.status(201).json(record);

      } catch (error) {
          return res.status(500).json({ error: 'Failed to add contact.' });
      }
  } else {
      return res.status(405).json({ error: 'Method not allowed.' }); // Only POST method is allowed
  }
}
*/


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const form = new IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Error parsing form data: ", err);
                return res.status(500).json({ error: 'Failed to parse form data.' });
            }

            const readFile = util.promisify(fs.readFile);


            const first_name = fields.first_name[0];
            const last_name = fields.last_name[0];
            const phone_number = fields.phone_number[0];
            const email = fields.email[0];
            const image_url = fields.image_url[0];

            const image = files.image && files.image[0];
            const imageContent = await readFile(files.image[0].filepath);
            const imageBase64 = imageContent.toString('base64');

            console.log("Received in API route:", { first_name, last_name, phone_number, email, image_url, image });

            if (!first_name || !last_name || !phone_number || !email) {
                return res.status(400).json({ error: 'Required fields are missing.' });
            }

            const record = await xata.db.contacts.create({
                first_name,
                last_name,
                phone_number,
                email,
                image_url,
                image: {
                    name: files.image[0].originalFilename || undefined,
                    mimetype: files.image[0].mimetype || undefined ,
                    base64Content: imageBase64,
                    enablePublicUrl: true,
                    mediaType: 'image'
                }
            });

            return res.status(201).json(record);
        });
    } else {
        return res.status(405).json({ error: 'Method not allowed.' }); // Only POST method is allowed
    }

}

