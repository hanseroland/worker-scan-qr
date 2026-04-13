import { IEmailService } from '@domain/services/IEmailService';
import { config } from '@shared/config';
import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export class EmailService implements IEmailService {
  private transporter: Transporter;

  // En-tête des e-mails pour la marque
  private emailHeader = `<div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
                                <h1 style="color: #1b1d9a;">Resume AI</h1>
                            </div>`;
  // Pied de page des e-mails
  private getEmailFooter() {
    return `
        <div style="text-align: center; margin-top: 20px; color: #888;">
        <p>Ce mail a été envoyé automatiquement, veuillez ne pas y répondre.</p>
        <p>© ${new Date().getFullYear()} Resume AI. Tous droits réservés.</p>
        </div>
    `;
  }

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: Number(config.email.port),
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  // Fonction générique pour envoyer un e-mail
  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string
  ): Promise<void> {
    try {
      const mailOptions = {
        from: `${config.app.companyName} <${config.email.user}>`,
        to,
        subject,
        html: `${this.emailHeader}${htmlContent}${this.getEmailFooter()}`,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email envoyé à ${to} avec succès via LWS.`);
      console.log(`✅ Email Subject : à ${subject}`);
      console.log(`✅ Email content est : ${htmlContent}`);
    } catch (error) {
      console.error(
        `❌ Erreur lors de l'envoi de l'e-mail à ${to} via LWS:`,
        error
      );
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, activationToken: string): Promise<void> {
    // Construire l'URL d'activation en fonction de l'environnement
    const activationUrl =
      config.app.env === 'production'
        ? `${config.app.corsOriginProd}/activate/${activationToken}`
        : `${config.app.corsOriginLocal}/activate/${activationToken}`;

    const subject = `Bienvenue chez ${config.app.companyName} - Activez votre compte`;
    const htmlContent = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2>Bonjour,</h2> 
            <p>Merci pour votre inscription.</p>
            <p>Veuillez cliquer sur le bouton ci-dessous pour activer votre compte :</p>
            <p style="text-align: center;">
                <a href="${activationUrl}" 
                   style="display: inline-block; padding: 10px 20px; background-color: #1b439a; color: #ffffff; text-decoration: none; border-radius: 5px;">
                    Activer mon compte
                </a>
            </p>
            <p>Ce lien est valide pendant 24 heures.</p>
        </div>
    `;

    return this.sendEmail(to, subject, htmlContent);
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const resetUrl =
      config.app.env === 'production'
        ? `${config.app.corsOriginProd}/reset-password/${token}`
        : `${config.app.corsOriginLocal}/reset-password/${token}`;
    const subject = `Réinitialisation de votre mot de passe chez ${config.app.companyName}`;
    const htmlContent = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2>Bonjour</h2>
            <p>Vous avez demandé une réinitialisation de votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
            <p style="text-align: center;">
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #1b439a; color: #ffffff; text-decoration: none; border-radius: 5px;">
                    Réinitialiser mon mot de passe
                </a>
            </p>
            <p>Ce lien est valide pour une durée limitée. Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail.</p>
            <p>À bientôt !</p>
        </div>
    `;
    return this.sendEmail(to, subject, htmlContent);
  }

  async sendEmployeeCode(
    to: string,
    employeeCode: string,
    companyName: string
  ): Promise<void> {
    const subject = `Votre code employé pour ${companyName}`;
    const htmlContent = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2>Bonjour,</h2>
            <p>Voici votre code employé pour accéder à l'application ${companyName} :</p>
            <p style="text-align: center; font-size: 24px; font-weight: bold; color: #1b439a;">${employeeCode}</p>
            <p>Veuillez utiliser ce code lors de votre première connexion.</p>
            <p>Merci et bienvenue chez ${companyName} !</p>
        </div>
    `;
    return this.sendEmail(to, subject, htmlContent);
  }
}
