import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { IPost } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  imports: [CardModule, ButtonModule, RouterLink],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent {
  private route = inject(ActivatedRoute);

  post: IPost = this.route.snapshot.data['post'];
}
