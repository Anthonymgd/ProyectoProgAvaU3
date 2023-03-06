import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MailerService } from './mailer.service';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule] // Agregar HttpClientModule aquí
    });
    service = TestBed.inject(MailerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});





