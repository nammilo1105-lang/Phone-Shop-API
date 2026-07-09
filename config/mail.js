module.exports = {
    mailHost: process.env.MAIL_HOST || "smtp.gmail.com",
    mailPort: process.env.MAIL_PORT || 465,
    mailSecure: process.env.MAIL_SECURE === "true" || true,
    mailUser: process.env.MAIL_USER || "",
    mailPass: process.env.MAIL_PASS || "",
    mailFrom: process.env.MAIL_FROM || "",
    mailTemplate: `${__dirname}/../src/emails/templates`,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    facebookClientId: process.env.FACEBOOK_CLIENT_ID,
    facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET
};
