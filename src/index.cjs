import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para ler JSON do corpo da requisição
app.use(express.json());

// Rota para receber dados do formulário e enviar email
app.post('/contato', async (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }

  // Configura o transporte do nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // você pode enviar para seu próprio email
    subject: `Mensagem do site de ${nome}`,
    text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao enviar email' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});