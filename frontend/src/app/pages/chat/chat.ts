import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { ChatMessage } from '../../models/chat.model';

const FAKE_ANSWERS: Omit<ChatMessage, 'id' | 'role'>[] = [
  {
    text: 'Machine learning is a field where algorithms learn patterns from data instead of following hand-written rules. The document describes three main types: supervised, unsupervised and reinforcement learning.',
    sources: [
      { documentName: 'Machine Learning Basics.pdf', page: 12 },
      { documentName: 'Machine Learning Basics.pdf', page: 15 },
    ],
  },
  {
    text: 'The paper evaluates its model on two benchmarks and reports an improvement over the baseline, mainly because of the larger training set.',
    sources: [{ documentName: 'Research Paper - NLP.pdf', page: 7 }],
  },
  {
    text: 'I could not find an answer to that in your documents. Try rephrasing the question, or upload a document that covers this topic.',
  },
];

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  messages = signal<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'Hi! Ask me anything about your uploaded documents.',
    },
  ]);

  draft = signal('');
  isTyping = signal(false);

  chatBox = viewChild<ElementRef<HTMLElement>>('chatBox');

  private nextId = 2;
  private answerIndex = 0;

  onInput(event: Event) {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  send() {
    const text = this.draft().trim();
    if (!text || this.isTyping()) return;

    this.messages.update((list) => [
      ...list,
      { id: this.nextId++, role: 'user', text },
    ]);
    this.draft.set('');
    this.isTyping.set(true);
    this.scrollToBottom();

    setTimeout(() => {
      const answer = FAKE_ANSWERS[this.answerIndex % FAKE_ANSWERS.length];
      this.answerIndex++;

      this.messages.update((list) => [
        ...list,
        { id: this.nextId++, role: 'assistant', ...answer },
      ]);
      this.isTyping.set(false);
      this.scrollToBottom();
    }, 1200);
  }

  private scrollToBottom() {
    setTimeout(() => {
      const el = this.chatBox()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}