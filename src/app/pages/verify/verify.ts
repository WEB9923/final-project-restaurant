import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify',
  imports: [FormsModule],
  templateUrl: './verify.html',
  styleUrl: './verify.css',
})
export class Verify {
  route = inject(ActivatedRoute);
  auth = inject(AuthService);

  code: string = '';
  emailFromUrl = this.route.snapshot.queryParams['email'] || '';

  handleVerify(evt: SubmitEvent): void {
    evt.preventDefault();

    this.auth.verify({ email: this.emailFromUrl, code: this.code }).subscribe();
  }
}
