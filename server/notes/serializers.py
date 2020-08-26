from rest_framework import serializers

from .models import Note, User


class NoteSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=30)
    description = serializers.CharField(max_length=1000)
    updated = serializers.CharField()
    owner = serializers.CharField(max_length=30)

    def create(self, validated_data):
        return Note.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.updated = validated_data.get('updated', instance.updated)

        instance.save()
        return instance


class UserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=30)
    password = serializers.CharField(max_length=30)
    token = serializers.CharField(max_length=36)

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.set_token()
        return user
