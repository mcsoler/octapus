from rest_framework.pagination import PageNumberPagination


class CustomPageNumberPagination(PageNumberPagination):
    """
    Paginacion personalizada que permite al cliente especificar el tamano de pagina.
    """
    page_size = 15  # Tamano de pagina por defecto
    page_size_query_param = 'page_size'  # Permite ?page_size=15
    max_page_size = 100  # Maximo permitido para evitar consultas muy grandes
