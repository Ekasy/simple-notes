from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist

from .models import Note, User
from .serializers import NoteSerializer, UserSerializer


class NoteViews(APIView):
    def get(self, request, pk=None):
        try:
            username = User.objects.get(token=request.headers['token']).username
        except:
            return error_handler('Missing token.', 500)
        if pk is None:
            notes = Note.objects.filter(owner=username)
            # notes = Note.objects.all()
            serializer = NoteSerializer(notes, many=True)
            return Response({"notes": serializer.data})
        else:
            note = get_object_or_404(Note.objects.all(), pk=pk, owner=username)
            # note = get_object_or_404(Note.objects.all(), pk=pk)
            serializer = NoteSerializer(note)
            return Response({"note ".format(pk): serializer.data})

    def post(self, request):
        note = request.data
        note['updated'] = '{}'.format(datetime.now())
        try:
            username = User.objects.get(token=request.headers['token']).username
        except:
            return error_handler('Missing token.', 500)
        note['owner'] = username
        serializer = NoteSerializer(data=note)
        if serializer.is_valid(raise_exception=True):
            note_save = serializer.save()
        return Response({
            "success": "Note {} create successful".format(note_save.id)
        })

    def put(self, request, pk):
        saved_note = get_object_or_404(Note.objects.all(), pk=pk)
        data = request.data
        data['updated'] = '{}'.format(datetime.now())
        serializer = NoteSerializer(instance=saved_note, data=data, partial=True)

        if serializer.is_valid(raise_exception=True):
            note_saved = serializer.save()
        return Response({
            "success": "Note {} updated successful".format(note_saved.id)
        })

    def delete(self, request, pk):
        note = get_object_or_404(Note.objects.all(), pk=pk)
        note.delete()
        return Response({
            "success": "Note {} delete successful".format(pk)
        })


class UserRegistrationView(APIView):
    def post(self, request):
        user = request.data
        try:
            username = user['username']
            password = user['password']
        except:
            return error_handler("Wrong request. JSON must has fields 'username' and 'password'", 500)
        if username == '' or password == '':
            return error_handler('Wrong request. JSON has empty fields', 500)

        try:
            obj = User.objects.get(username=username)
        except ObjectDoesNotExist:
            obj = None
        if obj is not None:
            return error_handler('This user has already exist', 500)

        user_save = User(username=username, password=password)
        user_save.set_token()
        user_save.save()

        return Response({
            "username": user_save.username,
            "token": user_save.token
        })


class UserLoginView(APIView):
    def post(self, request):
        user = request.data
        try:
            username = user['username']
            password = user['password']
        except:
            return error_handler("Wrong request. JSON must has fields 'username' and 'password'", 500)
        if username == '' or password == '':
            return error_handler('Wrong request. JSON has empty fields', 500)

        try:
            obj = User.objects.get(username=username, password=password)
        except ObjectDoesNotExist:
            obj = None
        if obj is None:
            return error_handler('This user not exist', 500)

        return Response({
            "username": obj.username,
            "token": obj.token
        })


def error_handler(context, code):
    return Response({
        "error_message": context,
        "code": code
    }, status=code)
