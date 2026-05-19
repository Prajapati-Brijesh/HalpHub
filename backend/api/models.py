from django.db import models

class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    image = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.name

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'pending'),
        ('confirmed', 'confirmed'),
        ('completed', 'completed'),
        ('cancelled', 'cancelled'),
    ]
    user = models.CharField(max_length=100)
    service = models.CharField(max_length=100)
    address = models.TextField()
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class Review(models.Model):
    user = models.CharField(max_length=100)
    service = models.CharField(max_length=100)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
