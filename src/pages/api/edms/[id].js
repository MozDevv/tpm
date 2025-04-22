// pages/api/edms/[id].js

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await fetch(
      `http://192.168.3.66:8000/api/v4/documents/${id}/files/${id}/download/`,
      {
        headers: {
          // Authorization: 'Bearer your_token',
        },
      }
    );

    if (!response.ok)
      return res.status(response.status).send('Error fetching document');

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    res.status(200).json({ base64 });
  } catch (err) {
    res.status(500).send('Server error');
  }
}
