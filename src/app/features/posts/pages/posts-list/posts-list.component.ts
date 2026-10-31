import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { finalize } from 'rxjs';
import { IPost } from '../../models/post.model';
import { PostApiService } from '../../services/post-api.service';
import { MessageService } from '../../../../services/message.service';

@Component({
  selector: 'app-posts-list',
  imports: [
    TableModule,
    ContextMenuModule,
    SkeletonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent {
  private api = inject(PostApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  posts: IPost[] = [];
  total = 0;
  first = 0;
  rows = 10;
  loading = false;
  skeletonRows = Array.from({ length: 10 });

  selectedPost: IPost | null = null;
  menuItems: MenuItem[] = [
    { label: 'View', icon: 'pi pi-eye', command: () => this.onView(this.selectedPost!) },
    { label: 'Edit', icon: 'pi pi-pencil', command: () => this.openEdit(this.selectedPost!) },
    { label: 'Delete', icon: 'pi pi-trash', command: () => this.onDelete(this.selectedPost!) },
  ];

  dialogVisible = false;
  editingPost: IPost | null = null;
  editForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    tags: [''],
    views: [0],
  });

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.api
      .getPosts(this.rows, this.first)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.posts = res.posts;
        this.total = res.total;
      });
  }

  onView(post: IPost): void {
    this.router.navigate(['/posts', post.id]);
  }

  openEdit(post: IPost): void {
    this.editingPost = post;
    this.editForm.setValue({
      title: post.title,
      tags: post.tags.join(', '),
      views: post.views,
    });
    this.dialogVisible = true;
  }

  saveEdit(): void {
    if (this.editForm.invalid || !this.editingPost) return;
    const { title, tags, views } = this.editForm.getRawValue();
    const body = {
      title,
      views: Number(views),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const id = this.editingPost.id;

    this.api.update(id, body).subscribe((updated) => {
      this.posts = this.posts.map((p) => (p.id === id ? { ...p, ...body, ...updated } : p));
      this.dialogVisible = false;
      this.messageService.showSuccess('Пост обновлён');
    });
  }

  onDelete(post: IPost): void {
    this.api.delete(post.id).subscribe(() => {
      this.posts = this.posts.filter((p) => p.id !== post.id);
      this.total--;
      this.messageService.showSuccess('Пост удалён');
    });
  }
}
