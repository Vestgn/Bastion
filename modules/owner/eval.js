/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');

  try {
    let evaled = eval(args.join(' '));
    if (typeof evaled !== 'string') {
      evaled = require('util').inspect(evaled);
    }
    if (message.deletable) {
      message.delete().catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        fields: [
          {
            name: ':inbox_tray:  INPUT',
            value: `\`\`\`js\n${args.join(' ')}\n\`\`\``
          },
          {
            name: ':outbox_tray:  OUTPUT',
            value: `\`\`\`js\n${clean(Bastion, evaled)}\n\`\`\``
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  catch(e) {
    if (message.deletable) {
      message.delete().catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        fields: [
          {
            name: ':no_entry:  ERROR',
            value: `\`\`\`js\n${clean(Bastion, e)}\n\`\`\``
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'eval',
  description: 'Evaluates any JavaScript statement.',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'eval <JavaScript code>',
  example: ['eval message.guild.members.size']
};

function clean(Bastion, text) {
  text = text.toString();
  if (text.includes(Bastion.token)) {
    text = text.replace(Bastion.token, 'Not for your :eyes:!');
  }
  if (typeof(text) === 'string') {
    return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  }
  return text;
}
