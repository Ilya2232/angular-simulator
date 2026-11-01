import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { IPostCreate } from '../../models/post.model';
import { PostApiService } from '../../services/post-api.service';
import { MessageService } from '../../../../services/message.service';

@Component({
  selector: 'app-post-create',
  imports: [ReactiveFormsModule, InputTextModule, TextareaModule, ButtonModule, RouterLink],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
})
export class PostCreateComponent {
  private fb = inject(FormBuilder);
  private api = inject(PostApiService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
    tags: [''],
    views: [0],
    userId: [1],
    likes: [0],
    dislikes: [0],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const data: IPostCreate = {
      title: v.title,
      body: v.body,
      tags: v.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      views: Number(v.views),
      userId: Number(v.userId),
      reactions: { likes: Number(v.likes), dislikes: Number(v.dislikes) },
    };

    this.api.create(data).subscribe(() => {
      this.messageService.showSuccess('Пост создан');
      this.router.navigate(['/posts']);
    });
  }
}
