import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { View } from '../../views/view';
import '@vaadin/vaadin-messages'
import '@vaadin/vaadin-text-field'
import "@vaadin/message-list/src/vaadin-message-list";
import "@vaadin/text-field/src/vaadin-text-field";
import "@vaadin/message-input/src/vaadin-message-input";
import Message from 'Frontend/generated/com/example/application/ChatEndpoint/Message';
import { ChatEndpoint } from 'Frontend/generated/endpoints';
import { TextFieldChangeEvent } from '@vaadin/text-field/src/vaadin-text-field';


@customElement('empty-view')
export class EmptyView extends View {
  @state() messages: Message[] = [];
  @state() userName = '';

  get formattedMessages() {
    return this.messages.map((m) => ({
      ...m,
      time: m.time ? new Date(m.time).toLocaleTimeString('en-US') : 'unknown',
    }));
  }



  render() {
    return html`
      <vaadin-message-list class="flex-grow" .items=${this.messages}></vaadin-message-list>
      <div class="flex p-s gap-s items-baseline">
        <vaadin-text-field placeholder="Name" @change=${this.userNameChange}></vaadin-text-field>
        <vaadin-message-input class="flex-grow" @submit=${this.submit}></vaadin-message-input>
      </div>
    
    `;
  }

  submit(e: CustomEvent) {
    ChatEndpoint.send({
      text: e.detail.value,
      userName: this.userName
    })
  }

  userNameChange(e: TextFieldChangeEvent) {
    this.userName = e.target.value;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add(
      'flex',
      'flex-col',
      'h-full',
      'box-border'
    );
    ChatEndpoint.join().onNext(
      (message) => {
        if (message) {
          this.messages = [...this.messages, message];
        }
      }
    );
  }
}
